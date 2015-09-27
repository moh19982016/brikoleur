<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/*">
    <text>
      [
      <xsl:apply-templates select="ul|ol" mode="root"/>
      ]
    </text>
  </xsl:template>

  <xsl:template match="ul" mode="root">
    <xsl:apply-templates/>
    <xsl:if test="following-sibling::*">,</xsl:if>
  </xsl:template>

  <xsl:template match="ul|ol">
    "list": [
    <xsl:apply-templates/>
    ]<xsl:if test="following-sibling::*">,</xsl:if>
  </xsl:template>

  <xsl:template match="li">
    {
    <xsl:apply-templates select="b"/>
    <xsl:apply-templates select="text()" mode="list-item"/>
    <xsl:apply-templates select="ul|ol"/>
    }<xsl:if test="following-sibling::*">,</xsl:if>
  </xsl:template>

  <xsl:template match="b">
    <xsl:choose>
      <xsl:when test="contains( ., '(' )">
        "name" : "<xsl:value-of select="normalize-space( substring-before( ., '(' ) )"/>",
        <xsl:if test="contains( ., '+' )">
          "extra_cost" : <xsl:value-of select="normalize-space( substring-before( substring-after( ., '+' ), ':' ) )"/>,
        </xsl:if>
      </xsl:when>
      <xsl:otherwise>
        "name" : "<xsl:value-of select="normalize-space( . )"/>,
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="text()" mode="list-item">
    "description" : "<xsl:value-of select="normalize-space( . )"/>"<xsl:if test="following-sibling::*">,</xsl:if>
  </xsl:template>

</xsl:stylesheet>